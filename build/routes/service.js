"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceRouter = void 0;
const express_1 = require("express");
const service_1 = require("../controllers/service");
const createServiceRouter = () => {
    const serviceRouter = (0, express_1.Router)();
    const serviceController = new service_1.ServiceController();
    serviceRouter.get('/', serviceController.getAll);
    return serviceRouter;
};
exports.createServiceRouter = createServiceRouter;
