from backend.database import engine

try:
    conn = engine.connect()
    print("✅ Connected to MySQL successfully!")
    conn.close()
except Exception as e:
    print("❌ Failed to connect to MySQL:", e)
