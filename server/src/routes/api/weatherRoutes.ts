import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }
  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    
  // TODO: save city to search history
  const cityWithId = await HistoryService.addCity(cityName);
  res.json({ city: cityWithId, weather: weatherData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to retrieve weather data or save city to search history' });
  }
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCity = await HistoryService.removeCity(id);
    if (deletedCity) {
      return res.json({message: 'City is successfully deleted', city: deletedCity});
    } else {
      return res.status(404).json({ error: 'City not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to delete city from search history' });
  }
});

export default router;
