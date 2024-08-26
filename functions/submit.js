exports.handler = async (event, context) => {
    const params = new URLSearchParams(event.body);
    const name = params.get('name');
    const gender = params.get('gender');
    const kakaoId = params.get('kakaoId');

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify({ message: 'Data received successfully!' })
    };
};
