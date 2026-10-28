import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';

export async function exportToDocx({ title, content, includeMorseTranscript, morseTranscript, author = 'MorseType Writer' }) {
  const paragraphs = [];

  // Title
  if (title) {
    paragraphs.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.TITLE,
        spacing: { after: 240 },
        alignment: AlignmentType.CENTER
      })
    );
  }

  // Document body split by lines
  const lines = (content || '').split('\n');
  lines.forEach(line => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: line || ' ',
            size: 24, // 12pt (half-points)
            font: 'Times New Roman'
          })
        ],
        spacing: { after: 120 }
      })
    );
  });

  // Optional Morse Code Transcript section at bottom
  if (includeMorseTranscript && morseTranscript) {
    paragraphs.push(
      new Paragraph({
        text: 'Morse Code Transcript',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 140 }
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: morseTranscript,
            size: 20, // 10pt
            font: 'Courier New',
            color: '555555'
          })
        ],
        spacing: { after: 180 }
      })
    );
  }

  // Metadata footer
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated via MorseType — Learn Morse Code Through Keyboard Practice (${new Date().toLocaleDateString()})`,
          size: 16, // 8pt
          font: 'Calibri',
          color: '888888',
          italics: true
        })
      ],
      spacing: { before: 400 },
      alignment: AlignmentType.RIGHT
    })
  );

  const doc = new Document({
    creator: author,
    title: title || 'Morse Document',
    description: 'Document generated using MorseType',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 twips
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        children: paragraphs
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const fileName = (title || 'morse-document')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_') + '.docx';

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
