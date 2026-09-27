"""MelkNama 360 API — a Redfin-style PropTech backend for the Iranian market."""
from __future__ import annotations

import statistics
from typing import Literal, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .data import AGENT_BY_ID, AGENTS, AMENITIES, CITIES, LISTING_BY_ID, LISTINGS, PROPERTY_TYPES

app = FastAPI(
    title="MelkNama 360 API",
    description="Property search, neighborhood pricing, verified listings and advisor network.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

LEADS: list[dict] = []


class Lead(BaseModel):
    listing_id: Optional[str] = None
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=8, max_length=20)
    message: str = ""
    kind: Literal["tour", "estimate", "callback"] = "tour"
    locale: Literal["fa", "en"] = "fa"


class EstimateRequest(BaseModel):
    city: str
    district: str
    area: int = Field(gt=10, le=2000)
    beds: int = Field(ge=0, le=10, default=2)
    year_built: int = Field(ge=1350, le=1410, default=1398)
    has_parking: bool = True
    has_elevator: bool = True


def _attach_agent(item: dict) -> dict:
    return {**item, "agent": AGENT_BY_ID.get(item["agent_id"])}


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "listings": len(LISTINGS), "agents": len(AGENTS)}


@app.get("/api/meta")
def meta() -> dict:
    return {
        "cities": [
            {
                "slug": c["slug"],
                "name_en": c["name_en"],
                "name_fa": c["name_fa"],
                "lat": c["lat"],
                "lng": c["lng"],
                "districts": [
                    {"en": d[0], "fa": d[1], "region": d[2], "avg_price_per_m": d[3]}
                    for d in c["districts"]
                ],
            }
            for c in CITIES
        ],
        "property_types": [{"key": p[0], "en": p[1], "fa": p[2]} for p in PROPERTY_TYPES],
        "amenities": [{"key": a[0], "en": a[1], "fa": a[2]} for a in AMENITIES],
        "sorts": ["newest", "price_asc", "price_desc", "area_desc", "ppm_asc", "trust_desc"],
    }


@app.get("/api/listings")
def listings(
    q: Optional[str] = None,
    city: Optional[str] = None,
    district: Optional[str] = None,
    deal: Optional[Literal["sale", "rent"]] = None,
    type: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    min_area: Optional[int] = None,
    max_area: Optional[int] = None,
    beds: Optional[int] = None,
    verified: Optional[bool] = None,
    tour360: Optional[bool] = None,
    amenities: Optional[str] = None,
    sort: str = "newest",
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=60),
) -> dict:
    rows = LISTINGS
    if q:
        needle = q.strip().lower()
        rows = [
            r
            for r in rows
            if needle in r["title_en"].lower()
            or needle in r["title_fa"]
            or needle in r["district_en"].lower()
            or needle in r["district_fa"]
            or needle in r["city_en"].lower()
            or needle in r["city_fa"]
            or needle in r["id"].lower()
        ]
    if city:
        rows = [r for r in rows if r["city"] == city]
    if district:
        rows = [r for r in rows if district.lower() in (r["district_en"].lower(), r["district_fa"])]
    if deal:
        rows = [r for r in rows if r["deal"] == deal]
    if type:
        rows = [r for r in rows if r["type"] == type]
    if min_price is not None:
        rows = [r for r in rows if r["price"] >= min_price]
    if max_price is not None:
        rows = [r for r in rows if r["price"] <= max_price]
    if min_area is not None:
        rows = [r for r in rows if r["area"] >= min_area]
    if max_area is not None:
        rows = [r for r in rows if r["area"] <= max_area]
    if beds:
        rows = [r for r in rows if r["beds"] >= beds]
    if verified:
        rows = [r for r in rows if r["verified"]]
    if tour360:
        rows = [r for r in rows if r["tour360"]]
    if amenities:
        wanted = {a.strip() for a in amenities.split(",") if a.strip()}
        rows = [r for r in rows if wanted <= {a["key"] for a in r["amenities"]}]

    keys = {
        "newest": lambda r: -r["days_on_market"],
        "price_asc": lambda r: r["price"],
        "price_desc": lambda r: -r["price"],
        "area_desc": lambda r: -r["area"],
        "ppm_asc": lambda r: r["price_per_m"],
        "trust_desc": lambda r: -r["trust_score"],
    }
    rows = sorted(rows, key=keys.get(sort, keys["newest"]))

    total = len(rows)
    start = (page - 1) * page_size
    window = rows[start : start + page_size]
    prices = [r["price_per_m"] for r in rows] or [0]
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": max(1, -(-total // page_size)),
        "avg_price_per_m": int(statistics.mean(prices)),
        "items": [_attach_agent(r) for r in window],
    }


@app.get("/api/listings/{listing_id}")
def listing_detail(listing_id: str) -> dict:
    item = LISTING_BY_ID.get(listing_id)
    if not item:
        raise HTTPException(status_code=404, detail="Listing not found")
    similar = [
        _attach_agent(r)
        for r in LISTINGS
        if r["id"] != listing_id and r["city"] == item["city"] and abs(r["area"] - item["area"]) <= 60
    ][:4]
    return {**_attach_agent(item), "similar": similar}


@app.get("/api/agents")
def agents(city: Optional[str] = None) -> dict:
    rows = [a for a in AGENTS if not city or a["city"] == city]
    out = []
    for a in rows:
        out.append({**a, "active_listings": sum(1 for l in LISTINGS if l["agent_id"] == a["id"])})
    return {"items": sorted(out, key=lambda a: (-a["rating"], -a["deals"]))}


@app.get("/api/market")
def market(city: Optional[str] = None) -> dict:
    rows = [r for r in LISTINGS if not city or r["city"] == city]
    if not rows:
        raise HTTPException(status_code=404, detail="No data for this city")
    sale = [r for r in rows if r["deal"] == "sale"]
    by_district: dict[str, dict] = {}
    for r in rows:
        b = by_district.setdefault(
            r["district_en"],
            {"district_en": r["district_en"], "district_fa": r["district_fa"], "ppm": [], "count": 0},
        )
        b["ppm"].append(r["price_per_m"])
        b["count"] += 1
    districts = sorted(
        (
            {
                "district_en": v["district_en"],
                "district_fa": v["district_fa"],
                "avg_price_per_m": int(statistics.mean(v["ppm"])),
                "count": v["count"],
            }
            for v in by_district.values()
        ),
        key=lambda x: -x["avg_price_per_m"],
    )
    trend = []
    for i in range(12):
        vals = [r["price_history"][i]["price"] / r["area"] for r in sale]
        trend.append(
            {
                "label": sale[0]["price_history"][i]["date"] if sale else "",
                "avg_price_per_m": int(statistics.mean(vals)) if vals else 0,
            }
        )
    return {
        "city": city or "all",
        "total_listings": len(rows),
        "verified_ratio": round(sum(1 for r in rows if r["verified"]) / len(rows), 3),
        "tour_ratio": round(sum(1 for r in rows if r["tour360"]) / len(rows), 3),
        "median_price": int(statistics.median([r["price"] for r in sale] or [0])),
        "avg_price_per_m": int(statistics.mean([r["price_per_m"] for r in rows])),
        "avg_days_on_market": int(statistics.mean([r["days_on_market"] for r in rows])),
        "districts": districts,
        "trend": trend,
    }


@app.post("/api/estimate")
def estimate(payload: EstimateRequest) -> dict:
    city = next((c for c in CITIES if c["slug"] == payload.city), None)
    if not city:
        raise HTTPException(status_code=404, detail="Unknown city")
    district = next(
        (d for d in city["districts"] if payload.district in (d[0], d[1])),
        city["districts"][0],
    )
    base = district[3]
    age = max(0, 1403 - payload.year_built)
    factor = 1.0
    factor -= min(age, 25) * 0.008
    factor += 0.04 if payload.has_parking else -0.03
    factor += 0.03 if payload.has_elevator else -0.02
    factor += 0.02 if payload.beds >= 3 else 0.0
    ppm = int(base * factor)
    value = ppm * payload.area
    comps = [
        _attach_agent(r)
        for r in LISTINGS
        if r["city"] == payload.city and r["district_en"] == district[0]
    ][:3]
    return {
        "price_per_m": ppm,
        "value": value,
        "range_low": int(value * 0.93),
        "range_high": int(value * 1.08),
        "confidence": 0.86 if comps else 0.62,
        "district_en": district[0],
        "district_fa": district[1],
        "comparables": comps,
    }


@app.post("/api/leads", status_code=201)
def create_lead(lead: Lead) -> dict:
    if lead.listing_id and lead.listing_id not in LISTING_BY_ID:
        raise HTTPException(status_code=404, detail="Listing not found")
    record = {"id": f"LD-{len(LEADS) + 1001}", **lead.model_dump()}
    LEADS.append(record)
    return {"ok": True, "lead": record}
