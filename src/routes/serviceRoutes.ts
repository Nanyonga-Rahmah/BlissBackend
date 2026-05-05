import { Router } from "express";

import { PostgresStorageRepo } from "../postgresRepo/repo";
import { UserController } from "../controllers/userController";
import { IService, IVariant } from "../interfaces/interfaces";
import { ServiceController } from "../controllers/serviceController";
import { upload } from "../middlewares/upload";
import { uploadImageToDropbox } from "../utils/UploadToDropBox";

export default function serviceRoutes(repo: PostgresStorageRepo) {
  const router = Router();
  const userController = new UserController(repo);
  const serviceController = new ServiceController(repo);

  // --- createCity ---

  router.post("/createService", upload.single("image"), async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization token is missing" });
      }

      const token = authHeader.split(" ")[1];

      let tokenVerificationResult;
      try {
        tokenVerificationResult = await userController.verifyToken(token ?? "");
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Token verification failed", error });
      }

      const { name, description, status, variants } = req.body;
      if (!name || !description || !status || !req.file) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const imageUrl = await uploadImageToDropbox(req.file);

      const service: IService = {
        name,
        description,
        status,
        image: imageUrl ?? "",
        variants: variants ? JSON.parse(variants) : [],
      };

      const newService = await serviceController.createService(service);

      res.status(201).json({
        message: "Service created successfully",
        service: newService,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post("/createVariant", async (req, res) => {
    try {
      const variant = req.body as IVariant;

      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization token is missing" });
      }

      const token = authHeader.split(" ")[1];

      let tokenVerificationResult;
      try {
        tokenVerificationResult = await userController.verifyToken(token ?? "");
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Token verification failed", error });
      }
      if (!variant.name || !variant.price || !variant.serviceId) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newVariant = await serviceController.createVariant(variant);

      res.status(201).json({
        message: "Variant created successfully",
        variant: newVariant,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // --- getAllCities ---
  router.get("/services", async (req, res) => {
    try {
      // const authHeader = req.headers.authorization;

      // if (!authHeader) {
      //   return res
      //     .status(401)
      //     .json({ message: "Authorization token is missing" });
      // }

      // const token = authHeader.split(" ")[1];

      // let tokenVerificationResult;
      // try {
      //   tokenVerificationResult = await userController.verifyToken(token ?? "");
      // } catch (error) {
      //   return res
      //     .status(401)
      //     .json({ message: "Token verification failed", error });
      // }

      const allServices = await serviceController.getAllServices();

      res.status(200).json({
        message: "Services retrieved successfully",
        services: allServices,
      });
    } catch (err: any) {
      res.status(500).json({ message: "failure" });
    }
  });

  router.get("/activeServices", async (req, res) => {
    try {
      const allServices = await serviceController.getActiveServices();

      res.status(200).json({
        message: "Services retrieved successfully",
        services: allServices,
      });
    } catch (err: any) {
      res.status(500).json({ message: "failure" });
    }
  });
  router.patch("/services/:id", upload.single("image"), async (req, res) => {
    try {
      const serviceId = Number(req.params.id);

      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "Invalid service id" });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Authorization token missing" });
      }

      const token = authHeader.split(" ")[1];

      try {
        await userController.verifyToken(token ?? "");
      } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      const updates: Partial<IService> = {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
      };

      if (req.body.removeImage === "true") {
        updates.image = "";
      }

      const file = req.file;
      if (file) {
        const imageUrl = await uploadImageToDropbox(file);
        updates.image = imageUrl;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No update data provided" });
      }

      const updatedService = await serviceController.updateService(
        serviceId,
        updates,
      );

      res.status(200).json({
        message: "Service updated successfully",
        service: updatedService,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  router.patch("/services/variants/:id", async (req, res) => {
    try {
      const variantId = Number(req.params.id);

      const updates = req.body as Partial<IVariant>;

      if (isNaN(variantId)) {
        return res.status(400).json({ message: "Invalid variant id" });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Authorization token missing" });
      }

      const token = authHeader.split(" ")[1];

      try {
        await userController.verifyToken(token ?? "");
      } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No update data provided" });
      }

      const updatedVariant = await serviceController.updateVariant(
        variantId,
        updates,
      );

      res.status(200).json({
        message: "Variant updated successfully",
        city: updatedVariant,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  router.delete("/services/:id", async (req, res) => {
    try {
      const serviceId = Number(req.params.id);

      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "Invalid service id" });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Authorization token missing" });
      }

      const token = authHeader.split(" ")[1];

      try {
        await userController.verifyToken(token ?? "");
      } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      const deletedService = await serviceController.deleteService(serviceId);

      res.status(200).json({
        message: "Service deleted successfully",
        service: deletedService,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });


  router.delete("/variants/:serviceId/:id", async (req, res) => {
    try {
      const variantId = Number(req.params.id);
      const serviceId = Number(req.params.serviceId);

      if (isNaN(variantId)) {
        return res.status(400).json({ message: "Invalid variant id" });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Authorization token missing" });
      }

      const token = authHeader.split(" ")[1];

      try {
        await userController.verifyToken(token ?? "");
      } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      const deletedVariant= await serviceController.deleteVariant(variantId,serviceId);

      res.status(200).json({
        message: "Variant deleted successfully",
        variant: deletedVariant,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get("/services/:id", async (req, res) => {
    try {
      const serviceId = Number(req.params.id);

      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "Invalid service id" });
      }

      const retrievedService =
        await serviceController.getServiceById(serviceId);

      res.status(200).json({
        message: "service retrieved successfully",
        service: retrievedService,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get("/serviceVariants/:id", async (req, res) => {
    try {
      const serviceId = Number(req.params.id);

      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "Invalid service id" });
      }

      const RetrievedVariants =
        await serviceController.getAllVariantsByServiceId(serviceId);

      res.status(200).json({
        message: "service retrieved successfully",
        variants: RetrievedVariants,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get("/service/:id", async (req, res) => {
    try {
      const serviceId = Number(req.params.id);

      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "Invalid service id" });
      }

      const RetrievedService =
        await serviceController.getServiceById(serviceId);

      res.status(200).json({
        message: "service retrieved successfully",
        variants: RetrievedService,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  //   router.post("/resend-link", async (req, res) => {
  //     try {
  //       const { email } = req.body;

  //       if (!email) {
  //         return res.status(400).json({ message: "Email  is required" });
  //       }

  //       const token = await userController.SendSignupLink(email);

  //       res.status(200).json({
  //         message: "successful",
  //       });
  //     } catch (err: any) {
  //       res.status(500).json({ message: "failure" });
  //     }
  //   });

  return router;
}
