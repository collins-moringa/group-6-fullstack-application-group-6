import requests
from flask import Blueprint, request, jsonify

who_bp = Blueprint("who", __name__)
who_bp.strict_slashes = False

WHO_BASE = "https://ghoapi.azureedge.net/api"


@who_bp.route("/<code>", methods=["GET"])
def get_indicator_data(code):
    country = request.args.get("country")
    params = {}
    if country:
        params["$filter"] = f"SpatialDim eq '{country}'"

    try:
        res = requests.get(f"{WHO_BASE}/{code}", params=params, timeout=15)
        res.raise_for_status()
        return jsonify(res.json().get("value", [])), 200
    except requests.exceptions.Timeout:
        return jsonify({"error": "WHO API timed out"}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 502
