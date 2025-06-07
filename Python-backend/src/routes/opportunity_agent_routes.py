from flask import Blueprint, request, jsonify
from controllers.opportunity_controller import handle_opportunity

bp = Blueprint('opportunity_agent_routes', __name__, url_prefix='/api/opportunity')
@bp.route('/handle', methods=['POST'])
def handle_opportunity_route():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    result = handle_opportunity()
    return jsonify(result), 200