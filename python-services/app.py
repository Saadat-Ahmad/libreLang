from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'Python AI Service'
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
