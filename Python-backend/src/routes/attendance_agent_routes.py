from flask import Blueprint, request, jsonify
from controllers.attendance_controller import handle_attendance

bp = Blueprint('attendance', __name__, url_prefix='/api/attendance')

@bp.route('/upload', methods=['POST'])
def upload_attendance():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400
    result = handle_attendance(file)
    return jsonify(result)
