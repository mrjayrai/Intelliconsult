def handle_resume_add(file):
    file.seek(0, 2)  # Move to end
    size = file.tell()
    file.seek(0)     # Reset to start

    return{
        'file':file.filename,
        'content_type':file.content_type,
        'size':size,
        'message': 'Resume file received successfully.'
    }