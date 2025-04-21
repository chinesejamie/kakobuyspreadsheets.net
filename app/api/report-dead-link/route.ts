import { NextRequest, NextResponse } from 'next/server';

// Webhook wird serverseitig geheim gehalten
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!; // In .env

export async function POST(request: NextRequest) {
  try {
    const { productLinkSpreadsheet, productLinkSource, email } = await request.json();
    if (!productLinkSpreadsheet || !productLinkSource) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const payload = {
      embeds: [
        {
          title: '🚨 Dead Link Report',
          color: 16711680,
          fields: [
            { name: 'Spreadsheet Link', value: productLinkSpreadsheet },
            { name: 'Taobao/Weidian Link', value: productLinkSource },
            { name: 'Notify Email', value: email || 'No email provided' },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!discordRes.ok) {
      throw new Error(`Failed to send to Discord: ${discordRes.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reporting dead link:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
