def handle_attendance(file):
    # For now, just return file name
    return {
        'filename': file.filename,
        'content_type': file.content_type
    }
