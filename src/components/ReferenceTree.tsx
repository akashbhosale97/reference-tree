import ELK from 'elkjs/lib/elk.bundled.js';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import CustomEntryNode from './CustomEntryNode';
import './CustomEntryNode.css';

const position = { x: 0, y: 0 };

const initialNodes = [
  {
    id: '1',
    type: 'customEntry',
    data: {
      entryName: 'Buzzer',
      contentType: 'Parts',
      locale: 'English - United States (M)',
      childCount: 2,
    },
    position,
  },
  {
    id: '2',
    type: 'customEntry',
    data: {
      entryName: 'Product Catalog',
      contentType: 'Page',
      locale: 'English - United Kingdom',
      childCount: 3,
    },
    position,
  },
  {
    id: '2a',
    type: 'customEntry',
    data: {
      entryName: 'Hero Banner',
      contentType: 'Component',
      locale: 'English - United States (M)',
      childCount: 1,
    },
    position,
  },
  {
    id: '2b',
    type: 'customEntry',
    data: {
      entryName: 'Featured Products',
      contentType: 'Module',
      locale: 'Spanish - Spain',
      childCount: 1,
    },
    position,
  },
  {
    id: '2c',
    type: 'customEntry',
    data: {
      entryName: 'Navigation Menu',
      contentType: 'Component',
      locale: 'French - France',
      childCount: 1,
    },
    position,
  },
  {
    id: '2d',
    type: 'customEntry',
    data: {
      entryName: 'Footer',
      contentType: 'Component',
      locale: 'German - Germany',
      childCount: 1,
    },
    position,
  },
  {
    id: '3',
    type: 'customEntry',
    data: {
      entryName: 'Blog Post',
      contentType: 'Article',
      locale: 'English - United States (M)',
      childCount: 0,
    },
    position,
  },
  {
    id: '4',
    type: 'customEntry',
    data: {
      entryName: 'Author Profile',
      contentType: 'Person',
      locale: 'English - United States (M)',
      childCount: 1,
    },
    position,
  },
  {
    id: '5',
    type: 'customEntry',
    data: {
      entryName: 'Media Gallery',
      contentType: 'Asset',
      locale: 'English - United States (M)',
      childCount: 2,
    },
    position,
  },
  {
    id: '6',
    type: 'customEntry',
    data: {
      entryName: 'Contact Form',
      contentType: 'Form',
      locale: 'Italian - Italy',
      childCount: 0,
    },
    position,
  },
  {
    id: '7',
    type: 'customEntry',
    data: {
      entryName: 'Newsletter',
      contentType: 'Module',
      locale: 'Portuguese - Brazil',
      childCount: 0,
    },
    position,
  },
];

const initialEdges = [
  {
    id: 'e12',
    source: '1',
    target: '2',
    type: 'smoothstep',
    // animated: true,
  },
  {
    id: 'e13',
    source: '1',
    target: '3',
    type: 'smoothstep',
    // animated: true,
  },
  {
    id: 'e22a',
    source: '2',
    target: '2a',
    type: 'smoothstep',
    // animated: true,
  },
  {
    id: 'e22b',
    source: '2',
    target: '2b',
    type: 'smoothstep',
    // animated: true,
  },
  {
    id: 'e2b2a',
    source: '2b',
    target: '2a',
    type: 'smoothstep',
    // animated: true,
  },
  {
    id: 'e2a6',
    source: '2a',
    target: '6',
    type: 'smoothstep',
    // animated: true,
  },
  {
    id: 'e22c',
    source: '2',
    target: '2c',
    type: 'smoothstep',
    // animated: true,
  },
  {
    id: 'e2c2d',
    source: '2c',
    target: '2d',
    type: 'smoothstep',
    // animated: true,
  },
  {
    id: 'e2d6',
    source: '2d',
    target: '6',
    type: 'smoothstep',
    // animated: true,
  },
  {
    id: 'e45',
    source: '4',
    target: '5',
    type: 'smoothstep',
    // animated: true,
  },
  {
    id: 'e56',
    source: '5',
    target: '6',
    type: 'smoothstep',
    // animated: true,
  },
  {
    id: 'e57',
    source: '5',
    target: '7',
    type: 'smoothstep',
    // animated: true,
  },
];

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.['elk.direction'] === 'RIGHT';
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',

      // Hardcode a width and height for elk to use when layouting.
      width: 280,
      height: 120,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

const LayoutFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const nodeTypes = useMemo(() => ({ customEntry: CustomEntryNode }), []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  const onLayout = useCallback(
    ({ direction, useInitialNodes = false }) => {
      const opts = { 'elk.direction': direction, ...elkOptions };
      const ns = useInitialNodes ? initialNodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;

      getLayoutedElements(ns, es, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
          fitView();
        }
      );
    },
    [nodes, edges]
  );

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    onLayout({ direction: 'DOWN', useInitialNodes: true });
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('node clicked', node);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      fitView>
      <Panel position='top-right'>
        <button
          className='xy-theme__button'
          onClick={() => onLayout({ direction: 'DOWN' })}>
          vertical layout
        </button>

        <button
          className='xy-theme__button'
          onClick={() => onLayout({ direction: 'RIGHT' })}>
          horizontal layout
        </button>
      </Panel>
      {/* <Background /> */}
    </ReactFlow>
  );
};

const ReferenceTree = () => (
  <ReactFlowProvider>
    <LayoutFlow />
  </ReactFlowProvider>
);

export default ReferenceTree;
