const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { GoogleAuth } = require('google-auth-library');

exports.handler = async (event, context) => {
  // 1. POST 요청인지 확인
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, gender, kakaoId, botField } = data; // botField 추가

    // 2. 스팸 방지 (Honeypot) 체크
    // 클라이언트에서 숨겨진 input(bot-field)에 값이 채워져 왔다면 봇으로 간주
    if (botField) {
      console.warn('Bot detected');
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: 'Spam detected' }) 
      };
    }

    // 3. 필수 데이터 서버측 유효성 검사
    if (!name || !gender || !kakaoId) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: '필수 데이터가 누락되었습니다.' }) 
      };
    }

    // 4. 데이터 정제 및 날짜 생성
    const cleanName = name.trim();
    const cleanGender = gender.trim();
    const cleanKakaoId = kakaoId.trim();
    
    // 현재 날짜 (KST 기준)
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000; // 9시간 밀리초
    const kstDate = new Date(now.getTime() + kstOffset);
    const dateStr = kstDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식 추출

    // 5. 구글 인증 세팅
    const keyFile = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      credentials: keyFile,
    });

    const client = await auth.getClient();
    const spreadsheetId = '1YAzOk0jtyF9U2LfwNiMNIdJ2vbgzScrM90oISCb2hbU';
    const range = 'sheet1!A2:D2';

    // 6. 구글 시트 데이터 추가
    await sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[cleanName, cleanGender, cleanKakaoId, dateStr]],
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Success' }),
    };

  } catch (error) {
    console.error('Submission Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '서버 오류가 발생했습니다.' }),
    };
  }
};