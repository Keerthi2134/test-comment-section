document.addEventListener('DOMContentLoaded', function () {
    loadComments();

    const socket = new WebSocket('ws://localhost:3000');

    socket.addEventListener('message', function (event) {
        const newComment = JSON.parse(event.data);
        displayComment(newComment);
    });
});

function loadComments() {
    const commentsContainer = document.getElementById('comments-list');
    fetch('http://127.0.0.1:5500/comments.json')
        .then(response => response.json())
        .then(comments => {
            comments.forEach(comment => {
                displayComment(comment);
            });
        });
}

function postComment() {
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();

    if (commentText !== '') {
        const newComment = { text: commentText };

        fetch('http://127.0.0.1:5500/comments.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newComment),
        })
            .then(response => response.json())
            .then(updatedComment => {
                // Clear the input
                commentInput.value = '';

                // Display the new comment
                displayComment(updatedComment);

                // Send the new comment to the server via WebSocket
                const socket = new WebSocket('ws://localhost:3000');
                socket.addEventListener('open', function () {
                    socket.send(JSON.stringify(updatedComment));
                });
            });
    }
}

function displayComment(comment) {
    const commentsContainer = document.getElementById('comments-list');
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.textContent = comment.text;
    commentsContainer.appendChild(commentElement);
}
