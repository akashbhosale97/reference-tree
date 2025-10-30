import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface CustomNodeData {
  entryName: string;
  contentType: string;
  locale: string;
  childCount?: number;
}

const CustomEntryNode = ({ data }: { data: CustomNodeData }) => {
  return (
    <div className='custom-entry-node'>
      <Handle type='target' position={Position.Left} />

      <div className='node-content'>
        <div className='entry-name'>{data.entryName}</div>

        <div className='content-type'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            className='icon'>
            <path
              d='M3 3h10v10H3V3z'
              stroke='currentColor'
              strokeWidth='1.5'
              fill='none'
            />
            <path
              d='M6 6h4M6 8h4M6 10h2'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
            />
          </svg>
          <span>{data.contentType}</span>
        </div>

        <div className='locale'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            className='icon'>
            <path
              d='M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z'
              stroke='currentColor'
              strokeWidth='1.5'
              fill='none'
            />
            <path
              d='M2 8h12M8 2c1.5 1.5 2 4 2 6s-.5 4.5-2 6c-1.5-1.5-2-4-2-6s.5-4.5 2-6z'
              stroke='currentColor'
              strokeWidth='1.5'
              fill='none'
            />
          </svg>
          <span>{data.locale}</span>
        </div>
      </div>

      {data.childCount !== undefined && data.childCount > 0 && (
        <>
          <Handle type='source' position={Position.Right} id='source' />
          <div className='child-count-badge'>{data.childCount}</div>
        </>
      )}
    </div>
  );
};

export default memo(CustomEntryNode);
