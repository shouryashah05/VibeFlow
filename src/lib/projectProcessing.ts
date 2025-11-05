import type { EdgeDefinition, ElementsDefinition } from 'cytoscape';
import type { ProcessedProject, ProjectFile } from '../types';

const MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1MB safety guard for browser processing.

const isIgnorableFile = (file: File) => {
  const segments = (file.webkitRelativePath || file.name).split('/');
  const name = segments[segments.length - 1];
  return name.startsWith('.') || file.size === 0;
};

const getExtension = (path: string) => {
  const lastSegment = path.split('/').pop() ?? path;
  if (!lastSegment.includes('.')) {
    return 'other';
  }
  return lastSegment.split('.').pop()?.toLowerCase() ?? 'other';
};

const readFileContent = async (file: File) => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return '';
  }
  return file.text();
};

const buildGraphElements = (files: ProjectFile[]): ElementsDefinition => {
  const nodeMap = new Map<string, { data: { id: string; label: string } }>();
  const edgeSet = new Set<string>();
  const edges: EdgeDefinition[] = [];

  const ensureNode = (id: string, label: string) => {
    if (!nodeMap.has(id)) {
      nodeMap.set(id, { data: { id, label } });
    }
  };

  const ensureEdge = (source: string, target: string) => {
    const id = `${source}->${target}`;
    if (!edgeSet.has(id)) {
      edgeSet.add(id);
      edges.push({ data: { id, source, target } });
    }
  };

  ensureNode('root', 'Project Root');

  files.forEach((file) => {
    const parts = file.path.split('/');
    let parentId = 'root';

    parts.forEach((part, index) => {
      const isLeaf = index === parts.length - 1;
      const prefix = isLeaf ? 'file' : 'dir';
      const idPath = parts.slice(0, index + 1).join('/');
      const nodeId = `${prefix}:${idPath}`;
      ensureNode(nodeId, part);
      ensureEdge(parentId, nodeId);
      parentId = nodeId;
    });
  });

  return {
    nodes: Array.from(nodeMap.values()),
    edges,
  };
};

export const processProjectFiles = async (
  fileList: FileList,
): Promise<ProcessedProject> => {
  const files = await Promise.all(
    Array.from(fileList)
      .filter((file) => !isIgnorableFile(file))
      .map(async (file) => {
        const path = file.webkitRelativePath || file.name;
        const content = await readFileContent(file);
        const lines = content ? content.split(/\r?\n/).length : 0;
        const extension = getExtension(path);

        return {
          name: file.name,
          path,
          content,
          extension,
          lines,
        } satisfies ProjectFile;
      }),
  );

  files.sort((a, b) => a.path.localeCompare(b.path));

  const extensionCounts = new Map<string, number>();
  let totalLines = 0;

  files.forEach((file) => {
    totalLines += file.lines;
    const current = extensionCounts.get(file.extension) ?? 0;
    extensionCounts.set(file.extension, current + 1);
  });

  const extensionHistogram = Array.from(extensionCounts.entries())
    .map(([extension, count]) => ({ extension, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const topFilesByLines = [...files]
    .filter((file) => file.lines > 0)
    .sort((a, b) => b.lines - a.lines)
    .slice(0, 12)
    .map((file) => ({ path: file.path, lines: file.lines }));

  const summary = {
    totalFiles: files.length,
    totalLines,
    extensionHistogram,
    lastUploadedAt: new Date().toISOString(),
  };

  return {
    files,
    summary,
    graphElements: buildGraphElements(files),
    topFilesByLines,
  } satisfies ProcessedProject;
};
