from functools import wraps

from flask import current_app, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from app.models.user import User

TOKEN_MAX_AGE = 8 * 60 * 60  # 8 hours


def _serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"])


def generate_token(user):
    return _serializer().dumps({"user_id": user.id})


def require_admin(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized", "message": "Missing or invalid Authorization header"}), 401

        token = auth_header.removeprefix("Bearer ").strip()
        try:
            payload = _serializer().loads(token, max_age=TOKEN_MAX_AGE)
        except (BadSignature, SignatureExpired):
            return jsonify({"error": "Unauthorized", "message": "Invalid or expired token"}), 401

        user = User.query.get(payload.get("user_id"))
        if not user or not user.is_admin:
            return jsonify({"error": "Forbidden", "message": "Admin privileges required"}), 403

        return view(*args, **kwargs)

    return wrapped
