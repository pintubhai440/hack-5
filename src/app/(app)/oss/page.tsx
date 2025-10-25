import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const resources = [
  {
    name: 'Next.js',
    category: 'Framework',
    description: 'The React framework for building full-stack web applications.',
    url: 'https://nextjs.org/',
  },
  {
    name: 'React',
    category: 'Library',
    description: 'A JavaScript library for building user interfaces.',
    url: 'https://react.dev/',
  },
  {
    name: 'Shadcn/UI',
    category: 'UI Components',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS.',
    url: 'https://ui.shadcn.com/',
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling',
    description: 'A utility-first CSS framework for rapid UI development.',
    url: 'https://tailwindcss.com/',
  },
  {
    name: 'Genkit',
    category: 'AI',
    description: 'An open source framework for building production-ready AI-powered apps.',
    url: 'https://firebase.google.com/docs/genkit',
  },
  {
    name: 'Lucide React',
    category: 'Icons',
    description: 'A simply beautiful and consistent open-source icon set.',
    url: 'https://lucide.dev/',
  },
  {
    name: 'Recharts',
    category: 'Charts',
    description: 'A composable charting library built on React components.',
    url: 'https://recharts.org/',
  },
  {
    name: 'Firebase',
    category: 'Backend',
    description: 'An app development platform that helps you build and grow apps.',
    url: 'https://firebase.google.com/',
  },
  {
    name: 'React Hook Form',
    category: 'Forms',
    description: 'Performant, flexible and extensible forms with easy-to-use validation.',
    url: 'https://react-hook-form.com/',
  },
  {
    name: 'Zod',
    category: 'Validation',
    description: 'TypeScript-first schema validation with static type inference.',
    url: 'https://zod.dev/',
  },
  {
    name: 'Google Fonts',
    category: 'Fonts',
    description: 'A library of free licensed font families.',
    url: 'https://fonts.google.com/',
  },
];

export default function OpenSourcePage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Open Source Resources</CardTitle>
          <CardDescription>
            This project is built with the help of these amazing open source projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.name}>
                  <TableCell className="font-medium">
                    <Link
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {resource.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{resource.category}</Badge>
                  </TableCell>
                  <TableCell>{resource.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
