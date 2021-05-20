export const getNamespace = (params, appendItems = []) =>
  `${params.namespace ? `${params.namespace}.` : ''}Messaging${
    appendItems.length > 0 ? `.${appendItems.join('.')}` : ''
  }`;
