# from flask import Blueprint, request, jsonify
# from controllers.resume_add_controller import handle_resume_add

# bp = Blueprint('resume_agent_routes', __name__,url_prefix='/api/resume')

# @bp.route('/add', methods=['POST'])
# def add_resume():
#     if "file" not in request.files:
#         return {"error": "File is missing in request", "status": "failure"}, 400
#     return handle_resume_add(request.files["file"])
#     file= request.files.get('file')
#     if not file:
#         return jsonify({'error': 'No file provided'}), 400
#     result = handle_resume_add(file)
#     return jsonify(result), 200

from flask import Blueprint, request, jsonify
from controllers.resume_add_controller import handle_resume_add

bp = Blueprint('resume_agent_routes', __name__, url_prefix='/api/resume')

@bp.route('/add', methods=['POST'])
def add_resume():
    file = request.files.get('file')
    
    if not file:
        return jsonify({"error": "File is missing in request", "status": "failure"}), 400

    result = handle_resume_add(file)

    # If result is a tuple with status code (from controller on exception)
    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]
    
    return jsonify(result), 200
