from flask import Blueprint, jsonify

from app.auth import require_admin
from app.models.user import User

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/users", methods=["GET"])
@require_admin
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200
