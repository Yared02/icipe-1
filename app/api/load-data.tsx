// pages/api/load-data.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { readFile } from 'fs/promises';
import path from 'path';
import XLSX from 'xlsx';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const filePath = path.resolve('ORDA.xlsx'); // Adjust path as needed
        const data = await readFile(filePath);
        const workbook = XLSX.read(data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
        res.status(200).json(jsonData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load data' });
    }
}