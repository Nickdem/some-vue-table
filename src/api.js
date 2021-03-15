const API_URL = 'https://jsonplaceholder.typicode.com/comments/';

export async function getAllComments() {
    const response = await fetch(API_URL);

    const json = await response.json();

    return json;
}

export async function updateCommentById(id, comment) {
    const response = await fetch(API_URL + id, {
        method: "PUT",
        body: JSON.stringify(comment),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    });
    console.log(response);
    //const json = await response.json();
    
    return;
}

export async function deleteCommentById(id) {
    const response = await fetch(API_URL + id, {
        method: "DELETE"
    });

    const json = await response.json();

    return json;
}

export async function addComment(comment) {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/comments/",
        {
            method: "POST",
            body: JSON.stringify(comment),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }
    );

    const json = await response.json();

    return json;
}