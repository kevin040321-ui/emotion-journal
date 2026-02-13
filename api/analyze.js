export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { diary } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "감정 분석 전문가처럼 행동하라."
        },
        {
          role: "user",
          content: `사용자의 일기 내용을 분석하라.

${diary}

다음 형식으로만 답하라:

1. 감정 키워드 3개
2. 주요 감정 강도 (0~100 숫자)
3. 하루 요약 (2줄)
4. 감정 경향 분석 (객관적 1문장)

위로나 조언은 하지 마라.
해석은 과장하지 말고 텍스트에 근거해서만 분석하라.`
        }
      ],
      temperature: 0.3
    })
  });

  const data = await response.json();

  res.status(200).json({
    result: data.choices[0].message.content
  });
}
