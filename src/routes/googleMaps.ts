import { Router } from 'express'
import { GoogleMapsController } from '../controllers/googleMaps'

const router = Router()

const googleMapsController = new GoogleMapsController()

router.get('/address', googleMapsController.getAddress)
router.get('/duration-time', googleMapsController.getDurationTimeBetweenTwoPointsByMode)


export default router