const User = require("../models/User");

class modelsController {
  async modelsList(req, res) {
    try {
      const models = await User.find({ userRole: "MODEL" });
      const searchModels = models.filter((model) =>
        model.userName.includes(req.body.values)
      );

      const modelInfo = searchModels.map((item) => {
        const obj = {
          userName: item.userName,
          userId: item.userId,
        };
        return obj;
      });

      res.json(modelInfo);
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }

  async getFilteredModels(req, res) {
    try {
      const models = await User.find({ userRole: "MODEL" });

      const filterModelArray = [];

      const ages = {
        Teenagers: [17, 23],
        Young: [22, 31],
        Mom: [30, 41],
        Mature: [40, 51],
        Granny: [50, 80],
      };
      if (req.query.age) {
        const filteredByAge = models.filter(
          (model) =>
            model.userProfile?.age > ages[req.query.age][0] &&
            model.userProfile?.age < ages[req.query.age][1]
        );
        filteredByAge.forEach((item) => {
          filterModelArray.push(item);
        });
      }
      if (req.query.bodyType) {
        const filteredByBodyType = models.filter(
          (model) => model.userProfile?.bodyType === req.query.bodyType
        );
        filteredByBodyType.forEach((item) => {
          filterModelArray.push(item);
        });
      }
      if (req.query.hair) {
        const filteredByHair = models.filter(
          (model) => model.userProfile?.hair === req.query.hair
        );
        filteredByHair.forEach((item) => {
          filterModelArray.push(item);
        });
      }
      if (req.query.ethnicity) {
        const filteredByEthnicity = models.filter(
          (model) => model.userProfile?.ethnicity === req.query.ethnicity
        );
        filteredByEthnicity.forEach((item) => {
          filterModelArray.push(item);
        });
      }
      if (
        !req.query.age &&
        !req.query.bodyType &&
        !req.query.hair &&
        !req.query.ethnicity
      ) {
        models.forEach((item) => {
          filterModelArray.push(item);
        });
      }

      if (
        (req.query.age ||
          req.query.bodyType ||
          req.query.hair ||
          req.query.ethnicity) &&
        filterModelArray.length === 0
      ) {
        return res.json([]);
      }

      const searchModels = filterModelArray.filter((model) =>
        model.userName.includes(req.query.searchQueryParam)
      );

      const modelInfo = searchModels.map((model) => {
        const modelObj = {
          userName: model.userName,
          userEmail: model.userEmail,
          userId: model.userId,
        };
        return modelObj;
      });
      res.json(modelInfo);
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }

  async numberTab(req, res) {
    try {
      const models = await User.find({ userRole: "MODEL" });
      const filterObj = {};
      filterObj.all = models.length;
      const ages = [
        [17, 23],
        [22, 31],
        [30, 41],
        [40, 51],
        [50, 80],
      ];
      const ageLengths = ages.map((age) => {
        const ageListLength = models.filter(
          (model) =>
            model.userProfile?.age > age[0] && model.userProfile?.age < age[1]
        );

        return ageListLength.length;
      });
      filterObj.age = {
        Teenagers: ageLengths[0],
        Young: ageLengths[1],
        Mom: ageLengths[2],
        Mature: ageLengths[3],
        Granny: ageLengths[4],
      };

      const bodyType = ["Skinny", "Athletic", "Curvy", "Bbw"];
      const bodyTypeLengths = bodyType.map((bodyType) => {
        const bodyTypeListLength = models.filter(
          (model) => model.userProfile?.bodyType === bodyType
        );
        return bodyTypeListLength.length;
      });
      filterObj.bodyType = {
        Skinny: bodyTypeLengths[0],
        Athletic: bodyTypeLengths[1],
        Curvy: bodyTypeLengths[2],
        Bbw: bodyTypeLengths[3],
      };

      const hair = ["Black", "Blond(e)", "Brown", "Ginger", "Grey", "Bald"];
      const hairLengths = hair.map((hair) => {
        const hairListLength = models.filter(
          (model) => model.userProfile?.hair === hair
        );
        return hairListLength.length;
      });
      filterObj.hair = {
        Black: hairLengths[0],
        "Blond(e)": hairLengths[1],
        Brown: hairLengths[2],
        Ginger: hairLengths[3],
        Grey: hairLengths[4],
        Bald: hairLengths[5],
      };

      const ethnicity = ["Arab", "Indian", "Asian", "Black", "Latina", "White"];
      const ethnicityLengths = ethnicity.map((ethnicity) => {
        const ethnicityListLength = models.filter(
          (model) => model.userProfile?.ethnicity === ethnicity
        );
        return ethnicityListLength.length;
      });
      filterObj.ethnicity = {
        Arab: ethnicityLengths[0],
        Indian: ethnicityLengths[1],
        Asian: ethnicityLengths[2],
        Black: ethnicityLengths[3],
        Latina: ethnicityLengths[4],
        White: ethnicityLengths[5],
      };

      res.json(filterObj);
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }

  async getAllModels(req, res) {
    try {
      const models = await User.find({ userRole: "MODEL" });
      const modelInfo = models.map((model) => {
        const modelObj = {
          userName: model.userName,
          userEmail: model.userEmail,
          userId: model.userId,
        };
        return modelObj;
      });
      res.json(modelInfo);
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }

  async model(req, res) {
    try {
      const { modelId } = req.body;
      const model = await User.findOne({ userId: modelId });
      const obj = {
        userName: model.userName,
        userId: model.userId,
        userProfile: model.userProfile,
        modelTokens: { type: Number, default: 0 },
      };
      res.json(obj);
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }

  async modelProfile(req, res) {
    try {
      const { modelId } = req.body;
      const model = await User.findOne({ userId: modelId });
      const modelProfile = model.get("userProfile");
      res.json(modelProfile);
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }

  async editModelProfile(req, res) {
    try {
      const userId = req.body.modelId;
      const profile = req.body.values;
      const model = await User.findOne({ userId });
      model.userProfile = profile;
      await model.save();
      res.json({ message: "profile changed successfully" });
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }

  async studioModels(req, res) {
    try {
      const { studioId } = req.body;
      const models = await User.find({ studioId: studioId });
      const modelsInfo = models.map((model) => {
        const obj = {
          userId: model.userId,
          userName: model.userName,
          userEmail: model.userEmail,
          userTokens: model.userTokens,
          isOnLine: model.isOnLine,
        };
        return obj;
      });
      res.json(modelsInfo);
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }

  async topModels(req, res) {
    try {
      const models = await User.find({ userRole: "MODEL" });
      res.json(models);
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }
}

module.exports = new modelsController();
