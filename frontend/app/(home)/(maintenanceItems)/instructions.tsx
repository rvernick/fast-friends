import { ensureString } from '@/common/utils';
import InstructionComponent from '@/components/instruction/InstructionComponent';
import { useLocalSearchParams } from 'expo-router';

export default function Instructions() {
  const search = useLocalSearchParams();
  const part = search.part || 'Chain';
  const action = search.action || 'Replace';

  return (
    <InstructionComponent part={ensureString(part)} action={ensureString(action)}/>
  );
}
