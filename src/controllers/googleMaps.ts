import { Request, Response } from 'express';
import { Client, Language, TravelMode } from "@googlemaps/google-maps-services-js";

export class GoogleMapsController {

    getAddress = async (req: Request, res: Response) => {

      if (!req.query.lat || !req.query.lng) {
        return res.status(400).json({
          success: false,
          data: [],
          menssage: 'lat, lng are required'
        });
      }

      const lat: number = Number(req.query.lat);
      const lng: number = Number(req.query.lng);

      const args = {
        params: {
          key: String(process.env.KEY_MAPS),
          latlng: {
            lat: lat,
            lng: lng,
          },
          language: Language.es,
        }
      };

      const client = new Client();
      const resp = await client.reverseGeocode(args);
      const address = resp.data.results[0];

      return res.status(201).json({
        success: true,
        data: address.formatted_address
      });
    }

    getDurationTimeBetweenTwoPointsByDriving = async (req: Request, res: Response) => {
      
      if (!req.query.originLat || !req.query.originLng || !req.query.destinationLat || !req.query.destinationLng) {
        return res.status(400).json({
          success: false,
          data: [],
          menssage: 'lat, lng are required'
        });
      }

      const originLat: number = Number(req.query.originLat);
      const originlng: number = Number(req.query.originLng);
      const destinationLat: number = Number(req.query.destinationLat);
      const destinationLng: number = Number(req.query.destinationLng);
      const mode: any = String(req.query.mode);

      let travelMode = TravelMode.driving;

      if (mode === 'bicycling') {
        travelMode = TravelMode.bicycling;
      }

      if (mode === 'walking') {
        travelMode = TravelMode.walking;
      }

      
      const args = {
        params: {
          key: String(process.env.KEY_MAPS),
          origins: [{
            lat: originLat,
            lng: originlng,
          }],
          destinations: [{
            lat: destinationLat,
            lng: destinationLng,
          }],
          mode: travelMode,
          language: Language.es,
        }
      };

      const client = new Client();
      const resp = await client.distancematrix(args);

      return res.status(201).json({
        success: true,
        data: resp.data.rows
      });
    }


}