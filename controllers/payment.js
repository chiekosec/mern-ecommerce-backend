const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "7mkbd69qqkprg5zq",
  publicKey: "pbbvjkjq3d4nb5mv",
  privateKey: "44a92f4be1d7a32b277871df57a25c9f",
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}).then((response) => {
    res.send(response);
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;

  gateway.transaction
    .sale({
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    })
    .then((result) => {
      res.send(result);
    });
};
