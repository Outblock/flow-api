import type { NextApiRequest, NextApiResponse } from 'next'
const sharp = require('sharp');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    const { url } = req.query
    const size = req.query.size || 800
    const response = await fetch(url as string)
    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer);

    try { 
        const pngbuffer = await sharp(buffer).resize(size).png().toBuffer()
        res.setHeader('Content-Type', 'image/png');
        res.send(pngbuffer);
    } catch (err) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
        res.send(buffer);
    }
}
