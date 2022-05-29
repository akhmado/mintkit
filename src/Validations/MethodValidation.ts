export function checkEnabledMethods(id: any, method: any, methods: any) {
  const CONSTANTS: any = {
    'GET': 'findOne',
    'DELETE': 'delete',
    'POST': 'create',
    'PATCH': 'update',
    'PUT': 'update'
  }

  let currentMethod = CONSTANTS[method];

  if (method === 'GET' && id) {
    currentMethod = 'findOne';
  }

  if (currentMethod && id && methods.hasOwnProperty(currentMethod) && methods[currentMethod]) {
    return true;
  }

  return !!(currentMethod && methods.hasOwnProperty(currentMethod) && methods[currentMethod]);

}