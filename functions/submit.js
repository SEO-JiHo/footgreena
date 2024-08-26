exports.handler = async (event, context) => {
    const { name, gender, kakaoId } = JSON.parse(event.body);
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data received successfully!' })
    };
  };
  