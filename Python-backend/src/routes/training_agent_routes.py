from flask import Blueprint, request, jsonify

from controllers.training_controller import handle_training
bp = Blueprint('training_agent_routes', __name__, url_prefix='/api/training')

@bp.route('/handle', methods=['POST'])
def handle_training_route():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    # result = handle_training()
    return handle_training()