export function checkEnabledMethods(id: any, method: any, methods: any) {
  let checkMethod: string = null;

  if (method === 'GET' && !id) {
    checkMethod = 'findMany';
  }

  if (method === 'GET' && !!id) {
    checkMethod = 'findOne';
  }

  if ((method === 'PATCH' || method === 'PUT') && !!id) {
    checkMethod = 'update';
  }

  if (method === 'DELETE') {
    checkMethod = 'delete';
  }

  if (method === 'POST') {
    checkMethod = 'create';
  }

  return checkMethod in methods
    ? methods[checkMethod]
    : false;
}