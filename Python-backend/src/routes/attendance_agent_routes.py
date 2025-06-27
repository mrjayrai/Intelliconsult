from flask import Blueprint, request, jsonify
from controllers.attendance_controller import handle_attendance_json

bp = Blueprint('attendance', __name__, url_prefix='/api/attendance')

@bp.route('/analyze', methods=['POST'])
def upload_attendance():
    data = request.get_json()
    consultants = data.get("consultants", [])
    result = handle_attendance_json(consultants)
    return jsonify(result)
