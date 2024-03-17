import z from 'zod';

z.coerce.string().email().min(5);
