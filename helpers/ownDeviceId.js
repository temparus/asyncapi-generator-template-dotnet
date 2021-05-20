export const getOwnDeviceId = (asyncapi, params) => {
  const allowedDeviceIds = asyncapi.ext('x-deviceIds') || [];
  let ownDeviceId = params.ownDeviceId;

  if (!ownDeviceId && allowedDeviceIds.length === 1) {
    return allowedDeviceIds[0];
  } else if (!ownDeviceId || !allowedDeviceIds.includes(ownDeviceId)) {
    throw new Error(
      `Template parameter "ownDeviceId" must be set to one of: ${allowedDeviceIds.join(
        ', '
      )}`
    );
  }
  return ownDeviceId;
};
