from flask import Blueprint, request, jsonify
from controllers.resume_add_controller import handle_resume_add

bp = Blueprint('resume_agent_routes', __name__,url_prefix='/api/resume')

@bp.route('/add', methods=['POST'])
def add_resume():
    file= request.files.get('file')
    if not file:
        return jsonify({'error': 'No file provided'}), 400
    result = handle_resume_add(file)
    return jsonify(result), 200