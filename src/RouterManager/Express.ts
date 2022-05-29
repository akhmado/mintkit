import { checkEnabledMethods } from '../Validations/MethodValidation';

export async function RouterManager({ req, res, next, manager, methods }: any) {
  const method = req.method;
  const id = +req.params.id;
  const body = req.body;

  /* Check if method allowed */
  if (!!methods) {
    const allowedMethod = checkEnabledMethods(id, method, methods);
    if (!allowedMethod) {
      return res.status(405).json({ message: 'Method is not allowed.' });
    }
  }

  /* Methods handler */
  if (method === 'GET' && id) {
    const data = await manager.findOne(id);
    res.json(data);
  }

  if (method === 'GET') {
    const data = await manager.findMany();
    res.json(data);
  }

  if (method === 'POST') {
    const data = await manager.create(body);
    res.json(data);
  }

  if (method === 'PATCH' || method === 'PUT') {
    const data = await manager.update(id, body);
    res.json(data);
  }

  if (method === 'DELETE') {
    const data = await manager.delete(id)
    res.json(data);
  }
}