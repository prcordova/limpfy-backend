const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

exports.register = async (req, res) => {
  try {
    const { fullName, email, cpf, phone, birthDate, password, address, role } =
      req.body;

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criação do usuário com todos os campos
    const user = new User({
      fullName,
      email,
      cpf,
      phone,
      birthDate,
      password: hashedPassword,
      address,
      role,
    });

    await user.save();

    res.status(201).json({ message: "Usuário registrado com sucesso." });
  } catch (err) {
    // Verifica erros de duplicação do Mongoose
    if (err.code === 11000) {
      return res.status(400).json({ message: "CPF ou email já cadastrado." });
    }
    // Verifica erros de validação do Mongoose
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      access_token: token,
      role: user.role,
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      birthDate: user.birthDate,
      address: user.address,
      hasAcceptedTerms: user.hasAcceptedTerms,
      termsAcceptedDate: user.termsAcceptedDate,
      workerDetails: user.workerDetails,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      hasAcceptedTerms: user.hasAcceptedTerms,
      termsAcceptedDate: user.termsAcceptedDate,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
