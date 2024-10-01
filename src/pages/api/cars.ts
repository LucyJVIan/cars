import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { Car } from '@/types/cars/carsType';
import { NextApiHandler } from 'next';
import type { Request, Response } from 'express';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'images');
    try {
      await fs.mkdir(uploadDir, { recursive: true }); 
      cb(null, uploadDir); 
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

interface MulterNextApiRequest extends NextApiRequest {
  file?: Express.Multer.File;
}

function runMiddleware(
  req: MulterNextApiRequest,
  res: NextApiResponse,
  fn: (req: Request, res: Response, callback: (error?: unknown) => void) => void
) {
  return new Promise<void>((resolve, reject) => {
    fn(req as unknown as Request, res as unknown as Response, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req: MulterNextApiRequest, res: NextApiResponse) => {
  const filePath = path.join(process.cwd(), 'src', 'server.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  const data: Car[] = JSON.parse(jsonData);

  if (req.method === 'GET') {
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    try {
      await runMiddleware(req, res, upload.single('image'));

      const imagePath = req.file ? `/images/${req.file.filename}` : '';

      const newCar: Car = {
        id: Date.now().toString(),
        brand: req.body.brand,
        model: req.body.model,
        color: req.body.color,
        price: parseFloat(req.body.price),
        year: parseInt(req.body.year, 10),
        engineType: req.body.engineType,
        transmission: req.body.transmission,
        range: parseInt(req.body.range, 10),
        image: imagePath, 
      };

      data.push(newCar);

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));

      return res.status(201).json({ message: 'Автомобиль успешно добавлен', imagePath });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ошибка загрузки файла' });
    }
  }

  return res.status(405).json({ message: 'Метод не разрешен' });
};

export default handler;
