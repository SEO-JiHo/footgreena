exports.handler = async (event, context) => {
    const { name, gender, kakaoId } = JSON.parse(event.body);
  
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
    },
      body: JSON.stringify({ message: 'Data received successfully!' })
    };
  };
  