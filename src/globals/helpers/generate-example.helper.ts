import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export function generateExample(include: Record<string, any>): any {
  const generate = (obj: any, key?: string): any => {
    if (obj === true) return getExampleValue(key);

    if (Array.isArray(obj)) {
      return [generate(obj[0], key)];
    }

    if (typeof obj === 'object' && obj !== null) {
      const result: Record<string, any> = {};
      for (const subKey in obj) {
        // ⛔ تجاهل select/include
        if (subKey === 'select' || subKey === 'include') {
          Object.assign(result, generate(obj[subKey], subKey)); // 👈 افرد القيم اللي جواهم بدل ما تحفظهم كـ select
        } else {
          result[subKey] = generate(obj[subKey], subKey);
        }
      }
      return result;
    }

    return getExampleValue(key);
  };

  const getExampleValue = (key?: string): any => {
    if (!key) return 'string';
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('id')) return 1;
    if (lowerKey.includes('date')) return new Date().toISOString();
    if (lowerKey.includes('email')) return 'user@example.com';
    if (lowerKey.includes('verified')) return true;
    if (lowerKey === 'lat') return '-53.349';
    if (lowerKey === 'lng') return '6.2603';
    if (lowerKey.includes('active')) return true;
    if (lowerKey.includes('image')) return 'https://example.com/avatar.png';
    if (lowerKey.includes('name')) return 'John Doe';
    if (lowerKey.includes('phone')) return '+123456789';
    if (lowerKey.includes('at')) return '2025-06-26T18:17:10.000Z';
    if (lowerKey.includes('address')) return '123 Main St';
    return 'string';
  };

  return generate(include);
}

interface ExampleConfig {
  title: string;
  body: any;
  paginated: boolean;
}

export function buildExamples(
  examples: ExampleConfig[],
  status = 200,
  contentType = 'application/json',
) {
  const formattedExamples: Record<string, any> = {};

  for (const { title, body, paginated } of examples) {
    const key = title.toLowerCase().replace(/\s+/g, '-');

    let dataExample: any;

    if (Array.isArray(body)) {
      // لو array، طبق generateExample على كل عنصر فيها
      dataExample = body.map((item) =>
        typeof item === 'object' ? generateExample(item) : item,
      );
    } else if (typeof body === 'object' && body !== null) {
      // لو object، طبق generateExample
      dataExample = generateExample(body);
    } else {
      // primitive or unexpected
      dataExample = body;
    }

    if (paginated) {
      formattedExamples[key] = {
        summary: title,
        value: {
          data: dataExample,
          total: 1,
        },
      };
    } else {
      formattedExamples[key] = {
        summary: title,
        value: {
          data: dataExample,
        },
      };
    }
  }

  return {
    status,
    content: {
      [contentType]: {
        examples: formattedExamples,
      },
    },
  };
}
export function ApiDefaultOkResponse(body: any = {}) {
  return applyDecorators(
    ApiOkResponse({
      content: {
        'application/json': {
          examples: {
            default: {
              value: {
                data: body,
              },
            },
          },
        },
      },
    }),
  );
}
