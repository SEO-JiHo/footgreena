const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { GoogleAuth } = require('google-auth-library');

exports.handler = async (event, context) => {
  const { name, gender, kakaoId } = JSON.parse(event.body);

  const keyFile = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    credentials: keyFile,
  });

  const client = await auth.getClient();

  const spreadsheetId = '1YAzOk0jtyF9U2LfwNiMNIdJ2vbgzScrM90oISCb2hbU';
  const range = 'sheet1!A2:C2';

  try {
    const response = await sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[name, gender, kakaoId]],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data added to Google Sheets!' }),
    };
  } catch (error) {
    console.error('Error appending data to Google Sheets:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add data to Google Sheets' }),
    };
  }
};
