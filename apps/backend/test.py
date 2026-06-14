import traceback

try:
    from app.routes import admin_routes
except Exception:
    with open("trace.txt", "w") as f:
        f.write(traceback.format_exc())
