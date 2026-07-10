"""Backend tests for AI Doctor landing site API."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # fallback: read frontend/.env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip()
                break
API = BASE_URL.rstrip("/") + "/api"


# ---------- stats ----------
class TestStats:
    def test_stats_shape(self):
        r = requests.get(f"{API}/stats", timeout=10)
        assert r.status_code == 200
        d = r.json()
        for k in ("studying_now", "cards_today", "students_joined"):
            assert k in d, f"missing {k}"
            assert isinstance(d[k], int), f"{k} not int: {d[k]}"


# ---------- reviews ----------
class TestReviews:
    def test_list_reviews_seeded(self):
        r = requests.get(f"{API}/reviews", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 6, f"expected >=6 seeded reviews, got {len(data)}"
        for rev in data:
            for k in ("name", "role", "rating", "text"):
                assert k in rev

    def test_create_review_appears_in_list(self):
        payload = {"name": "TEST_Reviewer", "role": "TEST_role",
                   "rating": 4, "text": "TEST_review_text_unique_marker"}
        r = requests.post(f"{API}/reviews", json=payload, timeout=10)
        assert r.status_code == 200, r.text
        created = r.json()
        assert created["name"] == payload["name"]
        assert created["rating"] == 4
        assert "id" in created

        # verify appears in GET
        r2 = requests.get(f"{API}/reviews", timeout=10)
        assert r2.status_code == 200
        texts = [x["text"] for x in r2.json()]
        assert payload["text"] in texts


# ---------- waitlist ----------
class TestWaitlist:
    def test_valid_waitlist_and_stats_increment(self):
        r0 = requests.get(f"{API}/stats", timeout=10)
        joined_before = r0.json()["students_joined"]

        payload = {"name": "TEST_User", "email": f"test_{int(time.time()*1000)}@med.school",
                   "year": "Year 3", "exam": "USMLE"}
        r = requests.post(f"{API}/waitlist", json=payload, timeout=10)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "id" in d
        assert d["email"] == payload["email"]

        r1 = requests.get(f"{API}/stats", timeout=10)
        joined_after = r1.json()["students_joined"]
        assert joined_after >= 89
        assert joined_after >= joined_before + 1, f"{joined_before}->{joined_after}"

    def test_invalid_email_rejected(self):
        r = requests.post(f"{API}/waitlist",
                          json={"name": "X", "email": "notanemail"}, timeout=10)
        assert r.status_code in (400, 422), r.status_code
