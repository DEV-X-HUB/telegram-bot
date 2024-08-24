import fs from 'fs-extra';
import axios from 'axios';
import { dirname, join, resolve } from 'path';
import { CleanUpImagesParams, SaveImageParams, SaveImageReturnType } from '../../types/params';

/**
 * Saves images to the specified folder and returns their paths.
 * @param folderName - The name of the folder where images will be saved.
 * @param fileIds - An array of file IDs to fetch and save.
 * @param fileLinks - An array of file url from .
 * @returns An array of file paths where the images are stored.
 */
export const saveImages = async ({ folderName, fileIds, fileLinks }: SaveImageParams): Promise<SaveImageReturnType> => {
  const folderPath = resolve(process.cwd(), 'uploads', 'images', folderName);
  await fs.ensureDir(folderPath);

  const filePaths: string[] = [];

  try {
    for (let i = 0; i < fileIds.length; i++) {
      const response = await axios.get(fileLinks[i], { responseType: 'arraybuffer' });
      const filePath = join(folderPath, `image_${fileIds[i]}_${i}.jpg`);

      await fs.writeFile(filePath, response.data);
      filePaths.push(filePath);
    }
  } catch (error: any) {
    console.error('Error saving images:', error);
    return { filePaths, status: 'fail', msg: error.message };
  }
  console.log(filePaths);
  return { filePaths, status: 'success', msg: '' };
};

export const cleanUpImages = async ({ filePaths }: CleanUpImagesParams): Promise<void> => {
  for (const filePath of filePaths) {
    try {
      await fs.remove(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      throw error;
    }
  }
};
