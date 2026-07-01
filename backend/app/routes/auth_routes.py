from flask import Blueprint, request, jsonify

from app.auth import generate_token
from app.models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Unauthorized", "message": "Invalid username or password"}), 401

    return jsonify({"token": generate_token(user), "user": user.to_dict()}), 200
