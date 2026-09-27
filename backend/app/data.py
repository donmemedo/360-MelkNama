"""Deterministic seed data for MelkNama 360 (ملک‌نما ۳۶۰)."""
from __future__ import annotations

import random
from datetime import date, timedelta
from typing import Any

rng = random.Random(360)

CITIES: list[dict[str, Any]] = [
    {
        "slug": "tehran",
        "name_en": "Tehran",
        "name_fa": "تهران",
        "lat": 35.7219,
        "lng": 51.3347,
        "districts": [
            ("Zaferanieh", "زعفرانیه", 1, 980),
            ("Elahieh", "الهیه", 1, 910),
            ("Saadat Abad", "سعادت‌آباد", 2, 720),
            ("Shahrak-e Gharb", "شهرک غرب", 2, 690),
            ("Jordan", "جردن", 3, 760),
            ("Vanak", "ونک", 3, 640),
            ("Mirdamad", "میرداماد", 3, 580),
            ("Pasdaran", "پاسداران", 4, 560),
            ("Tehranpars", "تهرانپارس", 8, 310),
            ("Sadeghieh", "صادقیه", 5, 340),
            ("Ekbatan", "اکباتان", 21, 290),
            ("Yousef Abad", "یوسف‌آباد", 6, 470),
        ],
    },
    {
        "slug": "karaj",
        "name_en": "Karaj",
        "name_fa": "کرج",
        "lat": 35.8400,
        "lng": 50.9391,
        "districts": [
            ("Gohardasht", "گوهردشت", 2, 230),
            ("Mehrshahr", "مهرشهر", 3, 250),
            ("Baghestan", "باغستان", 4, 170),
            ("Azimieh", "عظیمیه", 1, 265),
        ],
    },
    {
        "slug": "isfahan",
        "name_en": "Isfahan",
        "name_fa": "اصفهان",
        "lat": 32.6546,
        "lng": 51.6680,
        "districts": [
            ("Mardavij", "مرداویج", 5, 210),
            ("Kaveh", "کاوه", 8, 140),
            ("Sepahan Shahr", "سپاهان‌شهر", 12, 185),
        ],
    },
    {
        "slug": "mashhad",
        "name_en": "Mashhad",
        "name_fa": "مشهد",
        "lat": 36.2972,
        "lng": 59.6067,
        "districts": [
            ("Sajjad", "سجاد", 1, 195),
            ("Hashemieh", "هاشمیه", 9, 175),
            ("Vakil Abad", "وکیل‌آباد", 9, 160),
        ],
    },
]

PROPERTY_TYPES = [
    ("apartment", "Apartment", "آپارتمان"),
    ("villa", "Villa", "ویلایی"),
    ("penthouse", "Penthouse", "پنت‌هاوس"),
    ("office", "Office", "دفتر کار"),
    ("land", "Land", "زمین"),
]

AMENITIES = [
    ("parking", "Parking", "پارکینگ"),
    ("elevator", "Elevator", "آسانسور"),
    ("storage", "Storage", "انباری"),
    ("balcony", "Balcony", "بالکن"),
    ("pool", "Pool", "استخر"),
    ("gym", "Gym", "سالن ورزش"),
    ("security", "24h Security", "نگهبانی ۲۴ ساعته"),
    ("smart", "Smart Home", "خانه هوشمند"),
    ("view", "City View", "ویو شهر"),
    ("renovated", "Renovated", "بازسازی‌شده"),
]

AGENT_NAMES = [
    ("Sara Ahmadi", "سارا احمدی"),
    ("Reza Kamali", "رضا کمالی"),
    ("Niloofar Tehrani", "نیلوفر تهرانی"),
    ("Amir Hosseini", "امیر حسینی"),
    ("Mahsa Rahmani", "مهسا رحمانی"),
    ("Kaveh Dastan", "کاوه داستان"),
    ("Yasaman Pour", "یاسمن پور"),
    ("Hamid Sharifi", "حمید شریفی"),
]

PHOTOS = [
    "photo-1560448204-e02f11c3d0e2",
    "photo-1512917774080-9991f1c4c750",
    "photo-1493809842364-78817add7ffb",
    "photo-1502672260266-1c1ef2d93688",
    "photo-1484154218962-a197022b5858",
    "photo-1522708323590-d24dbb6b0267",
    "photo-1583608205776-bfd35f0d9f83",
    "photo-1600596542815-ffad4c1539a9",
    "photo-1600585154340-be6161a56a0c",
    "photo-1600607687939-ce8a6c25118c",
    "photo-1600566753086-00f18fb6b3ea",
    "photo-1600210492486-724fe5c67fb0",
    "photo-1567496898669-ee935f5f647a",
    "photo-1586023492125-27b2c045efd7",
    "photo-1615873968403-89e068629265",
    "photo-1560185007-cde436f6a4d0",
]


def fa_digits(text: str) -> str:
    """Latin digits → Persian digits, for user-facing Persian copy."""
    return text.translate(str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹"))


def _img(seed: int, w: int = 1200) -> str:
    pid = PHOTOS[seed % len(PHOTOS)]
    return f"https://images.unsplash.com/{pid}?auto=format&fit=crop&w={w}&q=70"


def _build_agents() -> list[dict[str, Any]]:
    agents = []
    for i, (en, fa) in enumerate(AGENT_NAMES):
        city = CITIES[i % len(CITIES)]
        agents.append(
            {
                "id": f"AG-{100 + i}",
                "name_en": en,
                "name_fa": fa,
                "city": city["slug"],
                "rating": round(rng.uniform(4.2, 5.0), 1),
                "reviews": rng.randint(24, 310),
                "deals": rng.randint(18, 240),
                "years": rng.randint(3, 18),
                "license": f"IR-{rng.randint(10000, 99999)}",
                "avatar": f"https://i.pravatar.cc/240?img={(i * 7 + 3) % 70}",
                "phone": f"0912{rng.randint(1000000, 9999999)}",
                "languages": ["fa", "en"] if i % 2 == 0 else ["fa"],
                "specialty_en": ["Luxury", "Residential", "Investment", "Rentals"][i % 4],
                "specialty_fa": ["لوکس", "مسکونی", "سرمایه‌گذاری", "اجاره"][i % 4],
            }
        )
    return agents


AGENTS = _build_agents()


def _build_listings() -> list[dict[str, Any]]:
    listings: list[dict[str, Any]] = []
    today = date.today()
    n = 0
    for city in CITIES:
        for d_en, d_fa, region, base_price in city["districts"]:
            for _ in range(5):
                n += 1
                ptype = rng.choice(PROPERTY_TYPES)
                deal = "rent" if n % 4 == 0 else "sale"
                area = rng.choice([55, 68, 74, 85, 96, 110, 125, 140, 168, 195, 240, 310])
                if ptype[0] == "villa":
                    area = rng.choice([180, 240, 320, 420])
                beds = max(1, min(5, area // 45))
                if ptype[0] in ("land", "office"):
                    beds = 0
                ppm = int(base_price * rng.uniform(0.82, 1.24))
                price = ppm * area
                rent_base = int(price * 0.0022)
                built = rng.randint(1385, 1403)
                days_ago = rng.randint(0, 90)
                agent = AGENTS[n % len(AGENTS)]
                amen = rng.sample(AMENITIES, rng.randint(3, 7))
                est = int(price * rng.uniform(0.94, 1.07))
                listings.append(
                    {
                        "id": f"MN-{2000 + n}",
                        "deal": deal,
                        "city": city["slug"],
                        "city_en": city["name_en"],
                        "city_fa": city["name_fa"],
                        "district_en": d_en,
                        "district_fa": d_fa,
                        "region": region,
                        "address_en": f"No. {rng.randint(1, 180)}, {d_en} St., District {region}, {city['name_en']}",
                        "address_fa": f"پلاک {rng.randint(1, 180)}، خیابان {d_fa}، منطقه {region}، {city['name_fa']}",
                        "title_en": (
                            f"{beds}-Bed {ptype[1]} in {d_en}" if beds
                            else f"{area} m² {ptype[1]} in {d_en}"
                        ),
                        "title_fa": fa_digits(
                            f"{ptype[2]} {beds} خوابه در {d_fa}" if beds
                            else f"{ptype[2]} {area} متری در {d_fa}"
                        ),
                        "type": ptype[0],
                        "type_en": ptype[1],
                        "type_fa": ptype[2],
                        "price": price,
                        "price_per_m": ppm,
                        "rent_deposit": rent_base * 40 if deal == "rent" else 0,
                        "rent_monthly": rent_base if deal == "rent" else 0,
                        "estimate": est,
                        "estimate_delta": round((est - price) / price * 100, 1),
                        "area": area,
                        "beds": beds,
                        "baths": max(1, beds - 1) if beds else 0,
                        "parking": 1 if "parking" in [a[0] for a in amen] else 0,
                        "floor": rng.randint(1, 18),
                        "year_built": built,
                        "lat": round(city["lat"] + rng.uniform(-0.07, 0.07), 5),
                        "lng": round(city["lng"] + rng.uniform(-0.09, 0.09), 5),
                        "images": [_img(n + k) for k in range(5)],
                        "amenities": [{"key": a[0], "en": a[1], "fa": a[2]} for a in amen],
                        "verified": n % 3 != 0,
                        "tour360": n % 2 == 0,
                        "hot": n % 7 == 0,
                        "open_house": (today + timedelta(days=rng.randint(1, 14))).isoformat() if n % 5 == 0 else None,
                        "listed_at": (today - timedelta(days=days_ago)).isoformat(),
                        "days_on_market": days_ago,
                        "views": rng.randint(120, 9800),
                        "saves": rng.randint(4, 420),
                        "walk_score": rng.randint(52, 98),
                        "transit_score": rng.randint(45, 96),
                        "trust_score": rng.randint(72, 99),
                        "agent_id": agent["id"],
                        "desc_en": (
                            f"A bright {ptype[1].lower()} of {area} m² in {d_en}, {city['name_en']}. "
                            "Verified documents, transparent pricing history and a 360° tour available on demand."
                        ),
                        "desc_fa": fa_digits(
                            f"یک {ptype[2]} نورگیر {area} متری در {d_fa}، {city['name_fa']}. "
                            "سند و مدارک تاییدشده، تاریخچه شفاف قیمت و امکان بازدید 360 درجه."
                        ),
                        "price_history": [
                            {
                                "date": (today - timedelta(days=30 * k)).isoformat(),
                                "price": int(price * (1 - 0.018 * k) * rng.uniform(0.985, 1.015)),
                            }
                            for k in range(11, -1, -1)
                        ],
                    }
                )
    return listings


LISTINGS = _build_listings()
LISTING_BY_ID = {x["id"]: x for x in LISTINGS}
AGENT_BY_ID = {a["id"]: a for a in AGENTS}
