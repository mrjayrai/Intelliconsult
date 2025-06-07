from flask import Flask

from routes import resume_agent_routes, attendance_agent_routes

def create_app():  
    app = Flask(__name__)
    
    # Register blueprints
    app.register_blueprint(resume_agent_routes.bp)
    app.register_blueprint(attendance_agent_routes.bp)
    
    return app