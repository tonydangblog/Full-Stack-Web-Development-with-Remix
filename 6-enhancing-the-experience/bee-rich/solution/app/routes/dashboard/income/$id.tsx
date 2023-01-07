import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData, useTransition } from '@remix-run/react';
import { Button } from '~/components/buttons';
import { Form, Input, Textarea } from '~/components/forms';
import { FloatingActionLink } from '~/components/links';
import { db } from '~/db.server';

async function deleteInvoice(request: Request, id: string): Promise<Response> {
  const referer = request.headers.get('referer');
  const redirectPath = referer || '/dashboard/income';

  try {
    await db.invoice.delete({ where: { id } });
  } catch (err) {
    throw new Response('Not found', { status: 404 });
  }

  if (redirectPath.includes(id)) {
    return redirect('/dashboard/income');
  }
  return redirect(redirectPath);
}

async function updateInvoice(formData: FormData, id: string): Promise<Response> {
  const title = formData.get('title');
  const description = formData.get('description');
  const amount = formData.get('amount');
  if (typeof title !== 'string' || typeof description !== 'string' || typeof amount !== 'string') {
    throw Error('something went wrong');
  }
  const amountNumber = Number.parseFloat(amount);
  await db.invoice.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      amount: amountNumber,
    },
  });
  return json({ success: true });
}

export async function action({ params, request }: ActionArgs) {
  const { id } = params;
  if (!id) throw Error('id route parameter must be defined');

  const formData = await request.formData();
  const intent = formData.get('intent');
  if (intent === 'delete') {
    return deleteInvoice(request, id);
  }
  if (intent === 'update') {
    return updateInvoice(formData, id);
  }
  throw new Response('Bad request', { status: 500 });
}

export async function loader({ params }: LoaderArgs) {
  const { id } = params;
  const invoice = await db.invoice.findUnique({ where: { id } });
  if (!invoice) throw new Response('Not found', { status: 404 });
  return json(invoice);
}

export default function IncomeDetailsPage() {
  const invoice = useLoaderData<typeof loader>();
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';
  const actionData = useActionData<typeof action>();

  return (
    <>
      <Form method="post" action={`/dashboard/income/${invoice.id}`}>
        <Input label="Title:" type="text" name="title" defaultValue={invoice.title} required />
        <Textarea label="Description:" name="description" defaultValue={invoice.description || ''} />
        <Input label="Amount (in USD):" type="number" defaultValue={invoice.amount} name="amount" required />
        <Button type="submit" name="intent" value="update" disabled={isSubmitting} isPrimary>
          {isSubmitting ? 'Save...' : 'Save'}
        </Button>
        <p aria-live="polite" className="text-green-600">
          {actionData?.success && 'Changes saved!'}
        </p>
      </Form>
      <FloatingActionLink to="/dashboard/income/">Add invoice</FloatingActionLink>
    </>
  );
}
